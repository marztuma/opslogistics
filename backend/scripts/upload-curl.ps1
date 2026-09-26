# Upload images to Cloudinary using REST API
param(
    [string]$CloudName = "tvt96rdp",
    [string]$ApiKey = "878758565797914"
)

$imageExtensions = @('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')
$baseProjectPath = "C:\Users\HP x360 1030 G2\OneDrive\Desktop\opslogistics"

$imageFolders = @(
    'logo',
    'home',
    'automotive',
    'case studies',
    'cold chain',
    'contract logistics',
    'cotsumer service',
    'customs',
    'ecommerce',
    'energy',
    'healthcare',
    'lastmile',
    'logistics',
    'retail',
    'technology',
    'white papers'
)

$uploadedImages = @{}
$totalUploaded = 0

Write-Host "🚀 Starting image upload to Cloudinary via REST API...`n"

foreach ($folder in $imageFolders) {
    $folderPath = Join-Path $baseProjectPath $folder

    if (-not (Test-Path $folderPath)) {
        Write-Host "⚠️  Skipping $folder - folder not found"
        continue
    }

    $uploadedImages[$folder] = @()

    $files = @(Get-ChildItem $folderPath -File | Where-Object {
        $imageExtensions -contains $_.Extension.ToLower()
    })

    if ($files.Count -eq 0) {
        Write-Host "ℹ️  $folder - no images found"
        continue
    }

    Write-Host "📁 $folder ($($files.Count) images)"

    foreach ($file in $files) {
        $filePath = $file.FullName
        $fileName = $file.Name

        try {
            Write-Host "  ⏳ $fileName..."

            # Use curl to upload to Cloudinary
            $response = & 'C:\Windows\System32\curl.exe' -X POST `
                "https://api.cloudinary.com/v1_1/$CloudName/image/upload" `
                -F "file=@$filePath" `
                -F "api_key=$ApiKey" `
                -F "folder=opslogistics/$folder" `
                -s

            # Parse JSON response
            $json = $response | ConvertFrom-Json -ErrorAction SilentlyContinue

            if ($json.secure_url) {
                $uploadedImages[$folder] += @{
                    originalName = $fileName
                    cloudinaryUrl = $json.secure_url
                    cloudinaryId = $json.public_id
                    documentType = $folder
                }
                Write-Host "  ✅ $fileName"
                $totalUploaded++
            }
            elseif ($json.error) {
                Write-Host "  ❌ $fileName - $($json.error.message)"
            }
            else {
                Write-Host "  ❌ $fileName - Unknown error"
            }

            Start-Sleep -Milliseconds 300
        }
        catch {
            Write-Host "  ❌ $fileName - $($_.Exception.Message)"
        }
    }

    Write-Host ""
}

# Save mapping to JSON file
$mappingPath = Join-Path $baseProjectPath "backend\config\cloudinary-images-mapping.json"
$json_output = @{}
foreach ($key in $uploadedImages.Keys) {
    $json_output[$key] = $uploadedImages[$key]
}
$json_output | ConvertTo-Json -Depth 5 | Out-File -FilePath $mappingPath -Encoding utf8

Write-Host "✨ Upload complete!"
Write-Host "📊 Mapping saved to: backend\config\cloudinary-images-mapping.json`n"

Write-Host "📈 Summary:"
foreach ($folder in $uploadedImages.Keys) {
    if ($uploadedImages[$folder].Count -gt 0) {
        Write-Host "  $folder : $($uploadedImages[$folder].Count) images"
    }
}

Write-Host "`n🎉 Total images uploaded: $totalUploaded"
