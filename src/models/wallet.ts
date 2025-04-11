import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';


export interface IWallet extends Document {
    customer: mongoose.Types.ObjectId | IUser;
    balance: number;
    totalRecharged: number;
    totalTokens: number;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema: Schema = new Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        balance: {
            type: Number,
            default: 0,
            min: 0
        },
        totalRecharged: {
            type: Number,
            default: 0,
            min: 0
        },
        totalTokens: {
            type: Number,
            default: 0,
            min: 0
        },
        totalSpent: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);

export default Wallet;