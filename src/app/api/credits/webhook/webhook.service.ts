import PaymentActivity from "@/models/payment-activity";
import Setting from "@/models/seting";
import { User } from "@/models/User";
import Wallet from "@/models/wallet";
interface Data {
    id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: Date;
    status: string;
    customer: string;
    wallet: string;
    transaction: string;
    transactionID: string;
}
// Tỉ lệ USD to Token và VND to USD sẽ được lấy từ settings
export async function validateAccessToken(token: string) {
    const accessToken = await Setting.findOne({ key: "TokenBankWebhook" })
        .select("value")
        .exec();
    return accessToken?.value?.trim() === token.trim();
}

// Lấy tỷ giá USD đến Token và VND đến USD từ cài đặt
export async function getExchangeRates() {
    try {
        const settings = await Setting.find({
            key: { $in: ["usdToTokenRate", "vndToUsdRate"] },
        }).select("key value").lean();

        // Giá trị mặc định
        let usdToTokenRate = 10; // 1 USD = 10 tokens
        let vndToUsdRate = 25000; // 25,000 VND = 1 USD

        // Nếu có cài đặt trong database thì sử dụng
        const usdToTokenSetting = settings.find(s => s.key === "usdToTokenRate");
        const vndToUsdSetting = settings.find(s => s.key === "vndToUsdRate");

        if (usdToTokenSetting && usdToTokenSetting.value) {
            usdToTokenRate = Number(usdToTokenSetting.value);
        }

        if (vndToUsdSetting && vndToUsdSetting.value) {
            vndToUsdRate = Number(vndToUsdSetting.value);
        }

        return { usdToTokenRate, vndToUsdRate };
    } catch (error) {
        console.error("Lỗi khi lấy tỷ giá:", error);
        // Trả về giá trị mặc định nếu có lỗi
        return { usdToTokenRate: 10, vndToUsdRate: 25000 };
    }
}

export async function convertVndToUsd(amountVnd: number): Promise<number> {
    const { vndToUsdRate } = await getExchangeRates();
    return amountVnd / vndToUsdRate;
}

export async function convertUsdToTokens(amountUsd: number): Promise<number> {
    const { usdToTokenRate } = await getExchangeRates();
    return Math.floor(amountUsd * usdToTokenRate);
}

export async function convertVndToTokens(amountVnd: number): Promise<number> {
    const amountUsd = await convertVndToUsd(amountVnd);
    return await convertUsdToTokens(amountUsd);
}

export async function processWebhookData(data: Data[]) {
    try {
        if (!Array.isArray(data)) {
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
                    return;
                }
                const paymentCode = matched[1];
                if (item.type !== "IN") {
                    return;
                }
                if (!item.amount || item.amount <= 0) {
                    return;
                }
                const ref = item.transactionID;
                const exist = await PaymentActivity.exists({
                    transaction: `$BANK${ref}`,
                    type: "bank",
                });

                if (exist) {
                    return;
                }
                const customer = await User.findOne({ paymentCode });

                if (!customer) {
                    return;
                }

                const wallet = await Wallet.findOne({ customer: customer._id });

                if (!wallet) {
                    return;
                }

                try {
                    const amountVnd = item.amount;
                    const tokensEarned = await convertVndToTokens(amountVnd);
                    const newBalance = wallet.balance + tokensEarned;
                    const message = `Nạp thành công ${amountVnd.toLocaleString('vi-VN')} VND qua ngân hàng (${tokensEarned} credits)`;

                    await Promise.all([
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