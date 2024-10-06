namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }

        public string BuyerId { get; set; } = string.Empty;

        public List<BasketItem> Items { get; set; } = new();

        public string PaymentIntentId { get; set; } = string.Empty;

        public string ClientSecret { get; set; } = string.Empty;

        public void AddItem(Product product, int quantity)
        {
            if (Items.Count(item => item.ProductId == product.Id) <= 0)
            {
                Items.Add(new BasketItem { ProductId = product.Id,Product = product,Quantity = quantity});
            }
            else
            {
                var existingItem = Items.Where(item=>item.ProductId == product.Id).FirstOrDefault();
                if (existingItem != null) {
                    existingItem.Quantity += quantity;
                }
            }
        }

        public void RemoveItem(Product product,int quantity) { 
            if(Items.Count(item => item.ProductId == product.Id) > 0)
            {
                var item = Items.Where(item => item.ProductId == product.Id).FirstOrDefault();
                if (item != null)
                {
                    item.Quantity -= quantity;
                }
                if (item != null && item.Quantity ==0)
                {
                    Items.Remove(item);
                }
            }
        }
    }
}
