import PaymentActivity from "@/models/payment-activity";
import Setting from "@/models/seting";
import { User } from "@/models/User";
import Wallet from "@/models/wallet";


// Hằng số chuyển đổi: 25,000 VND = 1$ = 1 token
const VND_TO_TOKEN_RATE = 25000;

/**
 * Xác thực token webhook từ ngân hàng
 */
export async function validateAccessToken(token: string) {
    const accessToken = await Setting.findOne({ key: "TokenBankWebhook" })
        .select("value")
        .exec();
    return accessToken?.value === token;
}

/**
 * Tính toán số tiền sau khuyến mãi
 */
export async function calculateAmountAfterDiscount(amount: number) {
    try {
        const discountSettings = await Setting.findOne({ key: "depositDiscounts" })
            .select("value")
            .exec();
        if (!discountSettings?.value) {
            return { newAmount: amount, discountPercent: 0 };
        }
        const discounts = JSON.parse(discountSettings.value);
        if (!Array.isArray(discounts) || discounts.length === 0) {
            return { newAmount: amount, discountPercent: 0 };
        }
        // Sắp xếp theo thứ tự giảm dần
        const sortedDiscounts = [...discounts].sort(
            (a, b) => b.minAmount - a.minAmount
        );
        // Tìm mức khuyến mãi phù hợp
        const applicableDiscount = sortedDiscounts.find(
            (d) => amount >= d.minAmount
        );
        if (!applicableDiscount) {
            return { newAmount: amount, discountPercent: 0 };
        }
        const discountPercent = applicableDiscount.discountPercent;
        const discountAmount = (amount * discountPercent) / 100;
        const newAmount = amount + discountAmount;
        return {
            newAmount,
            discountPercent,
        };
    } catch (error) {
        console.error("Lỗi tính toán khuyến mãi:", error);
        return { newAmount: amount, discountPercent: 0 };
    }
}

/**
 * Chuyển đổi từ VND sang token
 */
export function convertVndToTokens(amountVnd: number): number {
    return Math.floor(amountVnd / VND_TO_TOKEN_RATE);
}

/**
 * Xử lý dữ liệu webhook từ ngân hàng
 */
export async function processWebhookData(data: any) {
    try {
        if (!Array.isArray(data)) {
            console.log("Lịch sử giao dịch không phải là mảng");
            return;
        }
        const settings = await Setting.find({
            key: { $in: ["bankPrefix", "bankSuffix"] },
        })
            .select("key value")
            .lean();
        const prefixSetting = settings.find(
            (setting) => setting.key === "bankPrefix"
        );
        const suffixSetting = settings.find(
            (setting) => setting.key === "bankSuffix"
        );
        const prefix = prefixSetting?.value;
        const suffix = suffixSetting?.value;
        if (!prefix || !suffix) {
            console.info("Thiếu cài đặt prefix hoặc suffix", { prefix, suffix });
            return;
        }
        await Promise.all(
            data.map(async (item) => {
                const escapeRegExp = (string: string) =>
                    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const escapedPrefix = escapeRegExp(prefix);
                const escapedSuffix = escapeRegExp(suffix);
                const pattern = new RegExp(
                    `${escapedPrefix}[^\\w\\s]*\\s*(\\d+)\\s*[^\\w\\s]*${escapedSuffix}`,
                    "i"
                );
                // In ra mô tả giao dịch để debug
                console.log("Mô tả giao dịch:", item.description);
                const matched = pattern.exec(item.description);
                console.log("Kết quả regex:", matched);
                if (!matched || !matched[1]) return;
                const paymentCode = matched[1];
                console.log("Mã giao dịch:" + paymentCode);
                if (item.type !== "IN") return;
                const ref = item.transactionID;
                const exist = await PaymentActivity.exists({
                    transaction: `$BANK${ref}`,
                    type: "bank",
                });
                if (exist) {
                    console.log("Giao dịch này đã tồn tại", exist);
                    return;
                }
                const customer = await User.findOne({ paymentCode });
                if (!customer) {
                    console.log("Không tìm thấy khách hàng");
                    return;
                }
                const wallet = await Wallet.findOne({ customer: customer._id });
                if (!wallet) return;
                try {
                    // Tính toán số tiền sau khuyến mãi
                    const detailDiscount = await calculateAmountAfterDiscount(item.amount);
                    const amountAfterDiscount = detailDiscount.newAmount;
                    // Chuyển đổi từ VND sang token (1$ = 25,000 VND = 1 token)
                    const tokensEarned = convertVndToTokens(amountAfterDiscount);
                    // Cập nhật số dư mới
                    const newBalance = wallet.balance + tokensEarned;
                    // Tạo thông báo
                    let message = `Nạp thành công ${item.amount} VND qua ngân hàng (${tokensEarned} token)`;
                    if (amountAfterDiscount > item.amount) {
                        message += `\nTặng thêm: ${detailDiscount.discountPercent}% giá trị nạp`;
                    }
                    await Promise.all([
                        PaymentActivity.create({
                            transaction: `$BANK${ref}`,
                            oldBalance: wallet.balance,
                            newBalance,
                            customer: customer._id,
                            wallet: wallet._id,
                            amount: item.amount,
                            type: "bank",
                            status: "success",
                            description: message,
                            depositDiscountPercent: detailDiscount.discountPercent,
                            tokensEarned: tokensEarned, // Lưu số token đã nhận
                        }),
                        wallet.updateOne({
                            $inc: {
                                totalRecharged: item.amount,
                                balance: tokensEarned, // Cập nhật số token, không phải số tiền
                                totalTokens: tokensEarned, // Thêm trường này nếu bạn muốn theo dõi tổng token
                            },
                        }),
                    ]);
                    console.log(`Đã cộng ${tokensEarned} token cho khách hàng ${customer.name || customer.paymentCode}`);
                } catch (error) {
                    console.log("Lỗi xử lý thanh toán:", error);
                }
            })
        );
    } catch (error) {
        console.log("Lỗi khi xử lý dữ liệu webhook", error);
    }
}