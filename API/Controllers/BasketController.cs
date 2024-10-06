using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseAPIController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext storeContext)
        {
            _context = storeContext;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDTO>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null)
                return NotFound();
            return basket.MapBasketToDTo();

        }


        [HttpPost]

        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            //get basket
            var basket = await RetrieveBasket(GetBuyerId());
            // create a basket
            if (basket == null)
            {
                basket = await CreateBasket();
            }

            // get product
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails { Title = "Product Not Found" });
            //add item
            basket.AddItem(product, quantity);
            //save changes
            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return CreatedAtRoute("GetBasket", basket.MapBasketToDTo());
            }
            return BadRequest(new ProblemDetails { Title = "Problem in adding item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            //get basket
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();
            // remove item or reduce quantity
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails { Title = "Product Not Found" });
            basket.RemoveItem(product, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) { return Ok(); }

            return BadRequest(new ProblemDetails { Title = "Problem in removing item from basket" });
        }

        private string GetBuyerId()
        {
            return User?.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private async Task<Basket?> RetrieveBasket(string buyerID)
        {
            if (string.IsNullOrEmpty(buyerID))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => (i as Basket).Items)
                .ThenInclude(p => (p as BasketItem).Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerID);
        }
        private async Task<Basket?> CreateBasket()
        {
            string buyerId = User?.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions() { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            Basket basket = new Basket() { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }
    }
}
