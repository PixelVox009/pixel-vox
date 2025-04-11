import PaymentActivity from "@/models/payment-activity";
import Setting from "@/models/seting";
import { User } from "@/models/User";
import Wallet from "@/models/wallet";

const USD_TO_TOKEN_RATE = 1;
const VND_TO_USD_RATE = 25000;
export async function validateAccessToken(token: string) {
    const accessToken = await Setting.findOne({ key: "TokenBankWebhook" })
        .select("value")
        .exec();
    return accessToken?.value?.trim() === token.trim();
}
export function convertVndToUsd(amountVnd: number): number {
    return amountVnd / VND_TO_USD_RATE;
}
export function convertUsdToTokens(amountUsd: number): number {
    return Math.floor(amountUsd / USD_TO_TOKEN_RATE);
}
export function convertVndToTokens(amountVnd: number): number {
    const amountUsd = convertVndToUsd(amountVnd);
    return convertUsdToTokens(amountUsd);
}
export async function processWebhookData(data: any) {
    try {
        if (!Array.isArray(data)) {
            console.log("Lịch sử giao dịch không phải là mảng:", typeof data);
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
            console.log("Thiếu cài đặt prefix hoặc suffix", { prefix, suffix });
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
                const matched = pattern.exec(item.description);
                if (!matched || !matched[1]) {
                    console.log("Không tìm thấy mã thanh toán trong mô tả");
                    return;
                }
                const paymentCode = matched[1];
                if (item.type !== "IN") {
                    console.log("Loại giao dịch không phải IN, bỏ qua");
                    return;
                }
                if (!item.amount || item.amount <= 0) {
                    console.log("Số tiền không hợp lệ:", item.amount);
                    return;
                }
                const ref = item.transactionID;
                const exist = await PaymentActivity.exists({
                    transaction: `$BANK${ref}`,
                    type: "bank",
                });
                if (exist) {
                    console.log("Giao dịch này đã tồn tại:", exist);
                    return;
                }

                const customer = await User.findOne({ paymentCode });
                if (!customer) {
                    console.log("Không tìm thấy khách hàng với mã:", paymentCode);
                    return;
                }
                const wallet = await Wallet.findOne({ customer: customer._id });
                if (!wallet) {
                    return;
                }
                try {
                    const amountVnd = item.amount;
                    const tokensEarned = convertVndToTokens(amountVnd);
                    const newBalance = wallet.balance + tokensEarned;
                    let message = `Nạp thành công ${amountVnd} VND qua ngân hàng (${tokensEarned} token)`;
                    const [activity] = await Promise.all([
                        PaymentActivity.create({
                            transaction: `$BANK${ref}`,
                            oldBalance: wallet.balance,
                            newBalance,
                            customer: customer._id,
                            wallet: wallet._id,
                            amount: amountVnd,
                            type: "bank",
                            status: "success",
                            description: message,
                            depositDiscountPercent: 0,
                            tokensEarned: tokensEarned,
                        }),
                        wallet.updateOne({
                            $inc: {
                                totalRecharged: amountVnd,
                                balance: tokensEarned,
                                totalTokens: tokensEarned,
                            },
                        }),
                    ]);
                } catch (error) {
                    console.log("Lỗi xử lý thanh toán:", error);
                }
            })
        );
    } catch (error) {
        console.log("Lỗi khi xử lý dữ liệu webhook:", error);
    }
}