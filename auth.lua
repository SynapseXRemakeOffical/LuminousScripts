local HttpService = game:GetService("HttpService")
local RbxAnalytics = game:GetService("RbxAnalyticsService")
local Players = game:GetService("Players")

-- CONFIG
local API = "https://divine-wildflower-033f.gzdoesedit.workers.dev"

local function Authenticate()
    -- 1. Get Key
    local key = getgenv().LicenseKey
    if not key then return game.Players.LocalPlayer:Kick("Key Not Found in getgenv().LicenseKey") end

    -- 2. Get HWID (Roblox Client ID)
    local hwid = RbxAnalytics:GetClientId()

    -- 3. Request Function Support
    local request = (syn and syn.request) or (http and http.request) or (http_request) or (fluxus and fluxus.request) or request

    -- 4. Verify
    local response = request({
        Url = API .. "/verify?key=" .. key .. "&hwid=" .. hwid,
        Method = "GET"
    })

    if response.StatusCode == 200 then
        -- 5. Success! Get the real script using the session token
        local token = response.Body
        local scriptResponse = request({
            Url = API .. "/fetch?token=" .. token,
            Method = "GET"
        })
        
        if scriptResponse.StatusCode == 200 then
            loadstring(scriptResponse.Body)()
        end
    elseif response.StatusCode == 403 then
        if response.Body == "HWID Mismatch" then
            game.Players.LocalPlayer:Kick("Security: Key is used on another device.")
        elseif response.Body == "Key Expired" then
            game.Players.LocalPlayer:Kick("Security: Key has expired.")
        else
            game.Players.LocalPlayer:Kick("Security: Invalid Key.")
        end
    else
        warn("Server Error: " .. response.StatusCode)
    end
end

Authenticate()
