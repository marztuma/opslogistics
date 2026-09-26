# Bulk upload all images to Cloudinary
$cloud = "tvt96rdp"
$key = "677327879636171"
$preset = "opslogistics"
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

$imageExtensions = @('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')
$uploadedImages = @{}
$totalUploaded = 0

Write-Host "Starting upload of all images to Cloudinary...`n"

foreach ($folder in $imageFolders) {
    $folderPath = Join-Path $baseProjectPath $folder

    if (-not (Test-Path $folderPath)) {
        continue
    }

    $uploadedImages[$folder] = @()
    $files = @(Get-ChildItem $folderPath -File | Where-Object { $imageExtensions -contains $_.Extension.ToLower() })

    if ($files.Count -eq 0) {
        continue
    }

    Write-Host "[FOLDER] $folder - $($files.Count) images"

    foreach ($file in $files) {
        try {
            $result = & 'C:\Windows\System32\curl.exe' -X POST "https://api.cloudinary.com/v1_1/$cloud/image/upload" `
                -F "file=@$($file.FullName)" `
                -F "api_key=$key" `
                -F "upload_preset=$preset" `
                -F "folder=opslogistics/$folder" `
                -s

            $json = $result | ConvertFrom-Json -ErrorAction SilentlyContinue

            if ($json.secure_url) {
                $uploadedImages[$folder] += @{
                    originalName = $file.Name
                    cloudinaryUrl = $json.secure_url
                    cloudinaryId = $json.public_id
                    folder = $folder
                }
                Write-Host "[OK] $($file.Name)"
                $totalUploaded++
            } else {
                Write-Host "[FAIL] $($file.Name)"
            }

            Start-Sleep -Milliseconds 200
        }
        catch {
            Write-Host "[ERROR] $($file.Name) - $($_.Exception.Message)"
        }
    }
    Write-Host ""
}

# Save mapping
$mappingPath = Join-Path $baseProjectPath "backend\config\cloudinary-images-mapping.json"
$uploadedImages | ConvertTo-Json -Depth 5 | Out-File -FilePath $mappingPath -Encoding utf8 -Force

Write-Host "===== UPLOAD COMPLETE ====="
Write-Host "Mapping saved to: backend/config/cloudinary-images-mapping.json`n"

Write-Host "Summary:"
foreach ($folder in $uploadedImages.Keys) {
    if ($uploadedImages[$folder].Count -gt 0) {
        Write-Host "  $folder : $($uploadedImages[$folder].Count) images"
    }
}

Write-Host "`nTotal uploaded: $totalUploaded images"
