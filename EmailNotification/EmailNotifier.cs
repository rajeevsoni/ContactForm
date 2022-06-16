using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;

namespace EmailNotification
{
    public static class EmailNotifier
    {
        [FunctionName("EmailNotifier")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log, ExecutionContext context)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            EmailRequest emailRequest = JsonConvert.DeserializeObject<EmailRequest>(requestBody);

            var config = GetConfiguration(context);
            var apiKey = config["SENDGRID_API_KEY"];
            var client = new SendGridClient(apiKey);
            var msg = CreateSendGridEmailMessage(emailRequest, config);
            var response = await client.SendEmailAsync(msg);
            log.LogInformation($"SendGrid response: {response.StatusCode}");

            return new StatusCodeResult((int)response.StatusCode);
        }

        private static IConfiguration GetConfiguration(ExecutionContext context)
        {
            var config = new ConfigurationBuilder()
            .SetBasePath(context.FunctionAppDirectory)
            .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

            return config;
        }

        private static SendGridMessage CreateSendGridEmailMessage(EmailRequest emailRequest, IConfiguration config)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(config["FromEmail"], config["FromName"]),
                Subject = emailRequest.Subject,
                PlainTextContent = emailRequest.Body
            };
            msg.AddTo(emailRequest.To);

            return msg;
        }
    }
}
