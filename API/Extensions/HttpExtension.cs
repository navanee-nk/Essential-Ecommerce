using API.RequestHelpers;
using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtension
    {
        public static void AddPaginationHeader(this HttpResponse httpResponse, MetaData metaData)
        {
            var option = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            httpResponse.Headers.Append("Pagination",JsonSerializer.Serialize(metaData,option));
            httpResponse.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
