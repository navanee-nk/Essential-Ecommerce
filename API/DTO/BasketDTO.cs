namespace API.DTO
{
    public class BasketDTO
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }
        public List<BasketItemDTO> basketItems { get; set; } 
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }
    }
}
