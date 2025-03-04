import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface ChatMessageAttributes {
    id: number;
    userId: number;
    room: string;
    message: string;
    type: 'message' | 'join' | 'leave';
    createdAt?: Date;
    updatedAt?: Date;
}

export type ChatMessageCreationAttributes = Optional<ChatMessageAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class ChatMessageModel extends Model<ChatMessageAttributes, ChatMessageCreationAttributes> implements ChatMessageAttributes {
    public id!: number;
    public userId!: number;
    public room!: string;
    public message!: string;
    public type!: 'message' | 'join' | 'leave';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ChatMessageModel {
    ChatMessageModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            room: {
                allowNull: false,
                type: DataTypes.STRING(100),
            },
            message: {
                allowNull: false,
                type: DataTypes.STRING(1000),
            },
            type: {
                 type: DataTypes.ENUM('message', 'join', 'leave'), 
                 allowNull: false 
                },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'chat_messages',
            sequelize,
        }
    );

    return ChatMessageModel;
}
