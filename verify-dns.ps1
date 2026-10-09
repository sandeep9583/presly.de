# verify-dns.ps1 - check presly.de is correctly pointed at GitHub Pages
# Run this after updating DNS in GoDaddy:  powershell -File verify-dns.ps1

$ErrorActionPreference = 'SilentlyContinue'

$expectA = @(
    '185.199.108.153',
    '185.199.109.153',
    '185.199.110.153',
    '185.199.111.153'
)

$authoritative = @('ns07.domaincontrol.com', 'ns08.domaincontrol.com')

function Write-Result($label, $ok, $detail) {
    if ($ok) {
        Write-Host ("[ OK ]   {0} - {1}" -f $label, $detail) -ForegroundColor Green
    } else {
        Write-Host ("[FAIL]   {0} - {1}" -f $label, $detail) -ForegroundColor Red
    }
}

Write-Host "`n=== presly.de DNS verification ===" -ForegroundColor Cyan
Write-Host "Authoritative nameservers: $($authoritative -join ', ')`n"

# --- www CNAME ---
$wwwTargets = @()
foreach ($ns in $authoritative) {
    $r = Resolve-DnsName -Name 'www.presly.de' -Type CNAME -Server $ns -DnsOnly
    foreach ($x in $r) { if ($x.NameTarget) { $wwwTargets += $x.NameTarget.TrimEnd('.') } }
}
$wwwTargets = $wwwTargets | Sort-Object -Unique
if ($wwwTargets -contains 'sandeep9583.github.io') {
    Write-Result 'www CNAME' $true ($wwwTargets -join ', ')
} elseif ($wwwTargets.Count -eq 0) {
    Write-Result 'www CNAME' $false 'no CNAME found - add CNAME www -> sandeep9583.github.io'
} else {
    Write-Result 'www CNAME' $false ("expected sandeep9583.github.io, got " + ($wwwTargets -join ', '))
}

# --- apex A ---
$apex = @()
foreach ($ns in $authoritative) {
    $r = Resolve-DnsName -Name 'presly.de' -Type A -Server $ns -DnsOnly
    foreach ($x in $r) { if ($x.IPAddress) { $apex += $x.IPAddress } }
}
$apex = $apex | Sort-Object -Unique
$missing = $expectA | Where-Object { $apex -notcontains $_ }
if ($apex.Count -gt 0 -and $missing.Count -eq 0) {
    Write-Result 'apex A' $true ($apex -join ', ')
} elseif ($apex.Count -eq 0) {
    Write-Result 'apex A' $false 'no A records found'
} else {
    Write-Result 'apex A' $false ('missing ' + ($missing -join ', ') + ' - current: ' + ($apex -join ', '))
}

# --- MX (contact@presly.de is the main CTA on the site) ---
$mx = @()
foreach ($ns in $authoritative) {
    $r = Resolve-DnsName -Name 'presly.de' -Type MX -Server $ns -DnsOnly
    foreach ($x in $r) { if ($x.NameExchange) { $mx += ($x.Preference.ToString() + ' ' + $x.NameExchange) } }
}
$mx = $mx | Sort-Object -Unique
if ($mx.Count -gt 0) {
    Write-Result 'MX' $true ($mx -join ', ')
} else {
    Write-Result 'MX' $false 'no MX records - contact@presly.de cannot receive mail'
}

# --- live HTTPS ---
foreach ($host_ in 'https://www.presly.de/', 'https://presly.de/') {
    try {
        $resp = Invoke-WebRequest -Uri $host_ -UseBasicParsing -TimeoutSec 20
        $len = [math]::Round($resp.RawContentLength / 1KB, 1)
        Write-Result ("live $host_") $true ("HTTP $($resp.StatusCode), $len KB")
    } catch {
        Write-Result ("live $host_") $false $_.Exception.Message
    }
}

Write-Host "`nDNS changes can take up to 24h to propagate. Re-run this script to check again." -ForegroundColor Yellow
