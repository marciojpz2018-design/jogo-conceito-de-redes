$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8000)
$listener.Start()
Write-Host 'Jogo disponível em http://127.0.0.1:8000/ (Ctrl+C para encerrar)'

try {
  while ($listener.Server.IsBound) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $request = $reader.ReadLine()
      while ($null -ne ($header = $reader.ReadLine()) -and $header.Length -gt 0) { }

      $relative = 'index.html'
      if ($request) {
        $parts = $request.Split(' ')
        if ($parts.Length -gt 1) {
          $relative = [Uri]::UnescapeDataString(($parts[1] -split '\?')[0].TrimStart('/'))
          if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
        }
      }

      $file = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
      $isInsideRoot = $file.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
      if ($isInsideRoot -and (Test-Path -LiteralPath $file -PathType Leaf)) {
        $type = switch ([System.IO.Path]::GetExtension($file).ToLowerInvariant()) {
          '.html' { 'text/html; charset=utf-8' }
          '.js' { 'text/javascript; charset=utf-8' }
          '.css' { 'text/css; charset=utf-8' }
          '.json' { 'application/json; charset=utf-8' }
          '.png' { 'image/png' }
          '.svg' { 'image/svg+xml' }
          default { 'application/octet-stream' }
        }
        $body = [System.IO.File]::ReadAllBytes($file)
        $status = '200 OK'
      } else {
        $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $type = 'text/plain; charset=utf-8'
        $status = '404 Not Found'
      }

      $head = [System.Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n")
      $stream.Write($head, 0, $head.Length)
      $stream.Write($body, 0, $body.Length)
      $stream.Flush()
      $reader.Dispose()
    } catch [System.IO.IOException] {
      # A browser can cancel an image request while changing screens.
    } finally {
      $client.Dispose()
    }
  }
} finally {
  $listener.Stop()
}
