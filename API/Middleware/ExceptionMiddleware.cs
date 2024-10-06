using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace API.Middleware
{

    public class ExceptionMiddleware : IMiddleware
    {
        
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger,IHostEnvironment env)
        {            
            _logger = logger;
            _environment = env;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex) { 
                
                _logger.LogError(ex,ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;
                var responseDetails = new ProblemDetails()
                {
                    Status = 500,
                    Detail = _environment.IsDevelopment() ? ex.StackTrace?.ToString() : null,
                    Title = ex.Message                    
                };

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(responseDetails, options);
                await context.Response.WriteAsync(json);

                
            }
        }
    }
}
