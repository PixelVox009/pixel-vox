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
    console.log("Starting webhook data processing. Total items:", data.length);

    try {
        if (!Array.isArray(data)) {
            console.log("Input is not an array. Exiting.");
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

        console.log("Bank prefix:", prefix);
        console.log("Bank suffix:", suffix);

        if (!prefix || !suffix) {
            console.log("Missing prefix or suffix. Exiting.");
            return;
        }

        for (const item of data) {
            console.log("Processing item:", item);

            const escapeRegExp = (string: string) =>
                string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const escapedPrefix = escapeRegExp(prefix);
            const escapedSuffix = escapeRegExp(suffix);

            // Updated regex to handle both cases
            const aiPattern = new RegExp(
                `${escapedPrefix}\\s*(\\d+)\\s*${escapedSuffix}\\s*(\\d+)?`,
                "i"
            );
            const matched = aiPattern.exec(item.description);

            console.log("Matched regex:", matched);

            if (!matched) {
                console.log("No match found for description. Skipping.");
                continue;
            }

            const paymentCode = matched[1];
            console.log("Payment Code:", paymentCode);

            if (item.type !== "IN") {
                console.log("Transaction type is not 'IN'. Skipping.");
                continue;
            }

            if (!item.amount || item.amount <= 0) {
                console.log("Invalid amount. Skipping.");
                continue;
            }

            const ref = item.transactionID;
            const exist = await PaymentActivity.exists({
                transaction: `$BANK${ref}`,
                type: "bank",
            });

            if (exist) {
                console.log("Transaction already exists. Skipping.");
                continue;
            }

            const customer = await User.findOne({ paymentCode });
            console.log("Customer found:", !!customer);

            if (!customer) {
                console.log("No customer found with payment code. Skipping.");
                continue;
            }

            const wallet = await Wallet.findOne({ customer: customer._id });
            console.log("Wallet found:", !!wallet);

            if (!wallet) {
                console.log("No wallet found for customer. Skipping.");
                continue;
            }

            try {
                const amountVnd = item.amount;
                let tokensEarned: number;

                if (matched[2]) {
                    tokensEarned = Number(matched[2]);
                    console.log("Using specified tokens:", tokensEarned);
                } else {
                    // Calculate tokens normally
                    tokensEarned = await convertVndToTokens(amountVnd);
                    console.log("Calculated tokens:", tokensEarned);
                }

                const newBalance = wallet.balance + tokensEarned;
                const message = `Successfully deposited ${amountVnd.toLocaleString('vi-VN')} VND via bank (${tokensEarned} credits)`;

                console.log("Creating payment activity...");
                const paymentActivity = await PaymentActivity.create({
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
                });
                console.log("Payment activity created:", paymentActivity);

                console.log("Updating wallet...");
                const walletUpdateResult = await Wallet.updateOne(
                    { _id: wallet._id },
                    {
                        $inc: {
                            totalRecharged: amountVnd,
                            balance: tokensEarned,
                            totalTokens: tokensEarned,
                        },
                    }
                );
                console.log("Wallet update result:", walletUpdateResult);

            } catch (error) {
                console.error("Error processing payment:", error);
            }
        }
    } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu webhook:", error);
    }
}