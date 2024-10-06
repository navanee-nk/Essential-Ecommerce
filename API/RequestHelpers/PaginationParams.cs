namespace API.RequestHelpers
{
    public class PaginationParams
    {
        public int MaxPageSize { get; set; } = 50;

        public int PageNumber { get; set; } = 1;

        private int _pageSize=6;
        public int PageSize
        {
            get => _pageSize; set => _pageSize = value > 50 ? MaxPageSize : value;
        }
    }
}
