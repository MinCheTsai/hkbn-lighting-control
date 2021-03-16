兩種環境: uat測試、prod正式環境

前後端各環境 config 檔案需手動同步

gateway & group 資料為寫死狀態

通知寄信功能為正式環境才需要，故 SES 相關設定直接在 AWS 網站操作
根據目前環境判斷是否建立寄信用的 lambda 與前端是否需要在更改排程後呼叫寄信 lambda

!注意：
bls 指令佈版會 cache 住 src 底下的檔案變更，切換環境佈版時因為只改 congfig 檔(不在 src 底下) 故會無法正確打包佈版。
把根目錄底下 checksum 刪除後，bls 指令佈版才會認為檔案有更新所以重新打包。

佈不同環境記得 bls 指令切換 project
UAT 佈在 MIAP UAT account: $ bls ad -n poc-karin-uat -o BucketName=poc-karin-uat-ap-southeast-1
PROD 佈在 BLS POC account: $ bls ad -n karin-poc-production -o BucketName=karin-poc-prod-ap-southeast-1
