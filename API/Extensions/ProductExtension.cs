using API.Entities;

namespace API.Extensions
{
    public static class ProductExtension
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query,string orderBy)
        {
            if (string.IsNullOrEmpty(orderBy)) return query.OrderBy(p=>p.Name);

            query = orderBy switch
            {
                "name" => query.OrderBy(p=>p.Name),
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
            };
            return query;
        }

        public static IQueryable<Product> SearchBy(this IQueryable<Product> query,string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;
            var lowerCaseTerm = searchTerm.Trim().ToLower();
            
            return query.Where(p=>p.Name.ToLower().Contains(lowerCaseTerm));
        }
        public static IQueryable<Product> Filter(this IQueryable<Product> query,string brand,string type)
        {
            if (string.IsNullOrEmpty(brand) && string.IsNullOrEmpty(type)) return query;

            List<string> brandList = new List<string>();
            List<string> typeList = new List<string>();
            if(!string.IsNullOrEmpty(brand))
                brandList.AddRange(brand.ToLower().Split(',').ToList());
            if (!string.IsNullOrEmpty(type))
                typeList.AddRange(type.ToLower().Split(',').ToList());
            query = query.Where(p=>brandList.Count ==0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p=>typeList.Count ==0 || typeList.Contains(p.Type.ToLower()));
            return query;
        }
    }
}
