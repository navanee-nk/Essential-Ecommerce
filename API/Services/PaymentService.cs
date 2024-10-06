using API.Entities;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _configuration;
        public PaymentService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PaymentIntent> CreateOrUpdatePayment(Basket basket)
        {
            StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];
            var service = new PaymentIntentService();
            var paymentIntent = new PaymentIntent();
            var subtotal = basket.Items.Sum(b=>b.Product.Price * b.Quantity);
            var deliveryFee = subtotal > 10000 ? 0 : 500;
            if(string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = deliveryFee + subtotal,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" },
                };
                paymentIntent = await service.CreateAsync(options);
                
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = deliveryFee + subtotal,                   
                };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }
            return paymentIntent;
        }
    }
}
