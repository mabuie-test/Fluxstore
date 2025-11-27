# mpesa-api

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**[English](README.md) | [Português](README.pt.md)**

PHP API for M-PESA integration (Mozambique).

## Installation

```bash
composer require emagombe/mpesa-api
```

## Configuration

Get your credentials at https://developer.mpesa.vm.co.mz/

```php
use emagombe\Mpesa;

$mpesa = Mpesa::init(
    $api_key,        // API Key from portal
    $public_key,     // Public Key from portal
    "development"    // "development" or "production"
);
```

## Operations

### C2B (Client → Business)

```php
$response = $mpesa->c2b([
    "value" => 10,
    "client_number" => "258840000000",
    "agent_id" => 171717,
    "transaction_reference" => 1234567,
    "third_party_reference" => 33333
]);

print_r($response);
```

### B2C (Business → Client)

```php
$response = $mpesa->b2c([
    "value" => 10,
    "client_number" => "258840000000",
    "agent_id" => 171717,
    "transaction_reference" => 1234567,
    "third_party_reference" => 33333
]);

print_r($response);
```

### B2B (Business → Business)

```php
$response = $mpesa->b2b([
    "value" => 10,
    "agent_id" => 171717,
    "agent_receiver_id" => 979797,
    "transaction_reference" => 1234567,
    "third_party_reference" => 33333
]);

print_r($response);
```

### Reversal

```php
$response = $mpesa->reversal([
    "value" => 10,
    "security_credential" => "",
    "indicator_identifier" => "",
    "transaction_id" => "",
    "agent_id" => 171717,
    "third_party_reference" => 33333
]);

print_r($response);
```

### Query Status

```php
$response = $mpesa->status([
    "transaction_id" => "",
    "agent_id" => 171717,
    "third_party_reference" => 33333
]);

print_r($response);
```

### Customer Name

**Note:** Requires production credentials.

```php
$response = $mpesa->customer_name([
    "client_number" => "258840000000",
    "agent_id" => 171717,
    "third_party_reference" => 33333
]);

print_r($response);
```

## Success Response

```json
{
    "output_ResponseCode": "INS-0",
    "output_ResponseDesc": "Request processed successfully",
    "output_TransactionID": "...",
    "output_ConversationID": "...",
    "output_ThirdPartyReference": "33333"
}
```

## License

GPL v3