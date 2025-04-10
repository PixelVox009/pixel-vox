import mongoose, { Schema, Document } from 'mongoose';
import { IWallet } from './wallet';
import { IUser } from './User';


export interface IPaymentActivity extends Document {
    transaction: string;
    oldBalance: number;
    newBalance: number;
    customer: mongoose.Types.ObjectId | IUser;
    wallet: mongoose.Types.ObjectId | IWallet;
    amount: number;
    type: string;
    status: string;
    description: string;
    depositDiscountPercent?: number;
    tokensEarned?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentActivitySchema: Schema = new Schema(
    {
        transaction: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        oldBalance: {
            type: Number,
            required: true
        },
        newBalance: {
            type: Number,
            required: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['bank', 'card', 'spend', 'refund', 'bonus']
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'success', 'failed', 'cancelled']
        },
        description: {
            type: String
        },
        depositDiscountPercent: {
            type: Number,
            default: 0
        },
        tokensEarned: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const PaymentActivity = mongoose.models.PaymentActivity ||
    mongoose.model<IPaymentActivity>('PaymentActivity', PaymentActivitySchema);

export default PaymentActivity;