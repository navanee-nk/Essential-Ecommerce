using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace API.Controllers
{

    public class ProductsController : BaseAPIController
    {
        private readonly StoreContext _storeContext;
        public ProductsController(StoreContext dbContext)
        {
            _storeContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = _storeContext.Products.Sort(productParams.orderBy)
                         .SearchBy(productParams.searchTerm)
                         .Filter(productParams.brand, productParams.type)
                         .AsQueryable();
            var products = await PagedList<Product>.ToPagedList(query,productParams.PageNumber,productParams.PageSize);
            Response.AddPaginationHeader(products.metaData);
            return products;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _storeContext.Products.FindAsync(id);
            if (product == null) { return NotFound(); }
            return product;
        }
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _storeContext.Products.Select(p=>p.Brand).Distinct().ToListAsync();
            var types = await _storeContext.Products.Select(p => p.Type).Distinct().ToListAsync();
            return Ok(new {brands,types});
        }
    }
}
