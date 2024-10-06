using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class AccountController : BaseAPIController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.FindByNameAsync(loginDTO.Username);


            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDTO.Password))
            {
                return Unauthorized();
            }

            var userBasket = await RetrieveBasket(loginDTO.Username);
            var annonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            if (annonBasket != null)
            {
                if (userBasket != null) _context.Baskets.Remove(userBasket);
                annonBasket.BuyerId = loginDTO.Username;
                Response.Cookies.Delete("BuyerId");
                await _context.SaveChangesAsync();
            }
            return new UserDTO
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = annonBasket != null ? annonBasket.MapBasketToDTo() : userBasket?.MapBasketToDTo(),
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO register)
        {
            var user = new User { UserName = register.Username, Email = register.Email };
            var result = await _userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded)
            {

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }
            await _userManager.AddToRoleAsync(user, "Member");
            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {

            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name);
            return new UserDTO
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDTo()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]

        public async Task<ActionResult<UserAddress>> GetUserAddress()
        {
            return await _userManager.Users
                .Where(user => user.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
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
    }
}
