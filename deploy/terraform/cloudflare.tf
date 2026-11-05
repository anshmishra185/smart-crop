# Cloudflare GeoDNS, WAF, and DDoS Mitigation Layer

resource "cloudflare_record" "apex" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  value   = "ingress-mumbai.krishisaarthi.in"
  type    = "CNAME"
  proxied = true
  ttl     = 1 # Auto
}

resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = "api"
  value   = "api-lb.krishisaarthi.in"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

# Strict TLS 1.3 Encryption & HSTS Preload
resource "cloudflare_zone_settings_override" "krishi_saarthi_settings" {
  zone_id = var.cloudflare_zone_id
  settings {
    ssl                      = "strict"
    min_tls_version          = "1.3"
    always_use_https         = "on"
    brotli                   = "on"
    http3                    = "on"
    zero_rtt                 = "on"
    websockets               = "on"
    opportunistic_encryption = "on"
    security_header {
      enabled            = true
      preload            = true
      max_age            = 63072000 # 2 years
      include_subdomains = true
      nosniff            = true
    }
  }
}

# L7 Rate Limiting Rule: Protect payment webhook & diagnostic inference endpoints
resource "cloudflare_rate_limit" "api_protection" {
  zone_id   = var.cloudflare_zone_id
  threshold = 120
  period    = 60
  match {
    request {
      url_pattern = "api.krishisaarthi.in/api/v1/*"
      schemes     = ["HTTPS"]
      methods     = ["POST", "PUT", "DELETE"]
    }
    response {
      statuses = [200, 201, 202, 400, 401, 403, 429]
    }
  }
  action {
    mode    = "challenge"
    timeout = 300
  }
  description = "Mitigate DDoS & credential brute-force attacks on financial/diagnostic APIs"
}

# OWASP Managed Core Rule Set
resource "cloudflare_ruleset" "waf_owasp" {
  zone_id     = var.cloudflare_zone_id
  name        = "krishi-saarthi-owasp-top-10"
  description = "FAANG Grade OWASP Top 10 Injection & XSS Mitigation"
  kind        = "zone"
  phase       = "http_request_firewall_managed"

  rules {
    action = "execute"
    action_parameters {
      id = "efb79d4499ac4aa5a5e71642db1814eb" # Cloudflare Managed Ruleset
    }
    expression  = "true"
    description = "Execute Cloudflare Managed Ruleset"
    enabled     = true
  }
}
