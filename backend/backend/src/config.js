import 'dotenv/config';
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: +(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  escrowFeeRate: +(process.env.ESCROW_FEE_RATE || 0.05),
  minWithdrawal: +(process.env.MIN_WITHDRAWAL || 50000),
  withdrawalFee: +(process.env.WITHDRAWAL_FEE || 6500),
  midtrans: {
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
  }
};
