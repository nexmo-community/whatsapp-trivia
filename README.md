# WhatsApp Trivia Game

This is a project that I worked on during Vonage OneHack 2020. It's a simple trivia game that downloads questions from the Open Trivia Database API and presents them to the user. It uses the Vonage Sandbox WhatsApp account.

It could do with some work - the error checking isn't fit for purpose and you might want to implement categories, difficulty levels, etc. See [here](https://opentdb.com/api_config.php) for details.

## To run it

1. Clone this repo to your local machine.

2. In your working directory, create a Nexmo application:

    ```
    nexmo app:create "WA Trivia App" --capabilities=messages --messages-inbound-url=https://example.com/webhooks/inbound-message --messages-status-url=https://example.com/webhooks/message-status --keyfile=private.key
    ```

    This downloads a `private.key` file containing your authentication details and a `.nexmo-app` file that contains those together with your `APPLICATION_ID`.

3. Copy `example.env` to `.env` and fill in the blanks. The `FROM_NUMBER` is your Nexmo virtual number. The `TO_NUMBER` is the number that identifies your WhatsApp account. The pre-filled `WHATSAPP_NUMBER` is for the Sandbox account. The `APPLICATION_ID` is the one you generated in the preceding step.

4. Run `ngrok` to get some temporary tunnel URLs:

    ```
    ngrok http 5000
    ```

5. Visit the [Messages Sandbox](https://dashboard.nexmo.com/messages/sandbox) and follow the instructions to whitelist your `TO_NUMBER`.

6. Enter the following URLs in the "Webhooks" section:
    - Inbound: `NGROK_URL/webhooks/inbound`
    - Status: `NGROK_URL/webhooks/status`

7. With ngrok running, launch your app:

    ```
    npm start
    ```

8. Send the word `quiz` to the WhatsApp Sandbox account and the quiz should start!
