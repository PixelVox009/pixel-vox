const VND_TO_USD_RATE = 25000;
export const formatVndToUsd = (vndAmount: number) => {
    const usdAmount = vndAmount / VND_TO_USD_RATE;
    return usdAmount.toFixed(2);
};