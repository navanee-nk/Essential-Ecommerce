namespace API.RequestHelpers
{
    public class ProductParams : PaginationParams
    {
        public string orderBy { get; set; } = string.Empty;
        public string searchTerm { get; set; } = string.Empty;
        public string brand { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
    }

    
}


