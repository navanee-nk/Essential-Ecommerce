using API.Data;
using API.DTO;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{

    public class PaymentController : BaseAPIController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentService;
        private readonly IConfiguration _config;

        public PaymentController(PaymentService paymentService, StoreContext context,IConfiguration configuration)
        {
            _context = context;
            _paymentService = paymentService;
            _config = configuration;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDTO>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets.RetrieveBasket(User.Identity.Name).FirstOrDefaultAsync();
            if (basket == null)
            {
                return NotFound();
            }
            var intent = await _paymentService.CreateOrUpdatePayment(basket);

            if (intent == null)
            {
                return BadRequest(new ProblemDetails { Title = "Problem creating Payment Intent" });
            }
            basket.PaymentIntentId = !string.IsNullOrEmpty(basket.PaymentIntentId) ? basket.PaymentIntentId : intent.Id;
            basket.ClientSecret = !string.IsNullOrEmpty(basket.ClientSecret) ? basket.ClientSecret : intent.ClientSecret;

            _context.Update(basket);
            var result = await _context.SaveChangesAsync() > 0;
            if (!result)
            {
                return BadRequest(new ProblemDetails { Title = "Problem updating basket with Payment Intent" });
            }
            return basket.MapBasketToDTo();
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new  StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
                                _config["StripeSettings:whSecret"]);
            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId
            == charge.PaymentIntentId);

            if (charge.Status == "succeeded") order.Status = Entities.OrderAggregate.OrderStatus.PAYMENT_RECEIVED;

            await _context.SaveChangesAsync();
            return new  EmptyResult();
        }
    }
}
