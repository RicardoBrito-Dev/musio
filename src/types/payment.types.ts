export type PaymentMethod = 'pix' | 'credit_card' | 'wallet' | 'mock';

export interface CreateSupportPaymentDTO {
  artistId: string;
  fanId: string;
  amountCents: number;
  message?: string;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderDTO {
  userId: string;
  artistId: string;
  items: {
    itemType: 'support' | 'product' | 'track' | 'album';
    id: string;
    priceCents: number;
  }[];
  paymentMethod: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  paymentId: string;
  status: 'pending' | 'paid' | 'failed';
  pixQrCode?: string;
  pixCopiaECola?: string;
  errorMessage?: string;
}

export interface PaymentProvider {
  name: string;
  createSupport(dto: CreateSupportPaymentDTO): Promise<PaymentResult>;
  createOrder(dto: CreateOrderDTO): Promise<PaymentResult>;
  checkPaymentStatus(paymentId: string): Promise<'pending' | 'paid' | 'failed'>;
}
