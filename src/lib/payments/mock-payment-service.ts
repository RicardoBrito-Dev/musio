import { PaymentProvider, CreateSupportPaymentDTO, CreateOrderDTO, PaymentResult } from '@/types/payment.types';

/**
 * Provedor Mock de pagamentos para o MVP da Musio.
 * Permite testar o fluxo de doação/apoio e compra de lançamentos sem queimar chaves de gateways reais.
 * Posteriormente pode ser substituído por AsaasPaymentProvider, PagarMePaymentProvider, etc.
 */
export class MockPaymentService implements PaymentProvider {
  public name = 'MockPaymentProvider';

  async createSupport(dto: CreateSupportPaymentDTO): Promise<PaymentResult> {
    void dto;
    const fakeOrderId = `ord_mock_${Date.now()}`;
    const fakePaymentId = `pay_mock_${Date.now()}`;

    // Simula geração de QR Code Pix imediato
    return {
      success: true,
      orderId: fakeOrderId,
      paymentId: fakePaymentId,
      status: 'pending',
      pixQrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Musio Pagamentos6009Sao Paulo62070503***6304E2CA',
      pixCopiaECola: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Musio Pagamentos6009Sao Paulo62070503***6304E2CA',
    };
  }

  async createOrder(dto: CreateOrderDTO): Promise<PaymentResult> {
    void dto;
    const fakeOrderId = `ord_mock_${Date.now()}`;
    const fakePaymentId = `pay_mock_${Date.now()}`;

    return {
      success: true,
      orderId: fakeOrderId,
      paymentId: fakePaymentId,
      status: 'pending',
      pixQrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Musio Pagamentos6009Sao Paulo62070503***6304E2CA',
      pixCopiaECola: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Musio Pagamentos6009Sao Paulo62070503***6304E2CA',
    };
  }

  async checkPaymentStatus(paymentId: string): Promise<'pending' | 'paid' | 'failed'> {
    void paymentId;
    // Para fins de teste no MVP, simula aprovação rápida
    return 'paid';
  }
}

export const defaultPaymentProvider = new MockPaymentService();
