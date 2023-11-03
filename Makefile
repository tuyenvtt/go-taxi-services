# Cách dùng: make {các-chỉ-mục-sau-đây}

# Trước khi chạy cần cài đặt postgres@14 và redis
#  - https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/
#  - https://redis.io/docs/install/install-redis/install-redis-on-mac-os/

# Chạy service user-management với port 8080
run-user-mangement:
	node services/user-management/app.js

# Chạy service booking-system với port 8081
run-booking-service:
	node services/booking-service/app.js

# Đăng kí một tài khoản mới với phone: 0121457698 và password: 123456
register: 
	curl -d '{"full_name":"Nguyen Van Ca","email":"canguyen@gmail.com","phone":"0121457698","password":"123456"}' -H "Content-Type: application/json" -X POST http://localhost:8080/v1/customer/register

# Lấy OTP từ response của api register nhập vào trường otp sau.
registerverify:
	curl -d '{"phone":"0121457698", "otp":"606687"}' -H "Content-Type: application/json" -X PUT http://localhost:8080/v1/customer/register/verify

# Đăng nhập bằng phone và password như bên dưới, sau khi đăng nhập sẽ trả về token, lấy token đó gắn vào tất cả các api dưới
login:
	curl -d '{"phone":"0121457698","password":"123456"}' -H "Content-Type: application/json" -X POST http://localhost:8080/v1/customer/login

# loginverify:
# 	curl -d '{"phone":"0121457698", "otp":"139188"}' -H "Content-Type: application/json" -X PUT http://localhost:8080/v1/customer/login/verify

# resetpassword:
# 	curl -d '{"phone":"0121457698"}' -H "Content-Type: application/json" -X POST http://localhost:8080/v1/customer/password/reset

# updatepassword:
# 	curl -d '{"password":"123456","token":"NDViYjhjMjI3ZjdlNTYzMGQzNWFiMWUxNGRhMjA1ZWJ8MTcxNzQ5MThiZTg4Y2I2MWMyODZlNzY4ZWUwYzhjMWN8YjZjNDJmODgwOTNjZjBkZGQwNTNlZTlkMzA0MjYxMzYwZmZiZTBmZjQyMmVkOTlkOWRlZDdlNzQ4N2NiODEzNzVhMWFlOGQwMDRmMDI3N2QwNTYyNTlmNTU2YTg5ZDRlZmU3ZjIy"}' -H "Content-Type: application/json" -X PUT http://localhost:8080/v1/customer/password/update

profile:
	curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiZWF0IjoxNjk3ODE5Mjg1MzY3LCJpYXQiOjE2OTc3MzI4ODV9.I6-aRCLi4m8dhTk0de3O6R0M0PaO62EnDGOATkJyd00" http://localhost:8080/v1/customer/profile?customer_id=1

updateprofile:
	curl -d '{"full_name":"Nguyen Van 3"}' -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiZWF0IjoxNjk2NTYwMDc4ODYxLCJpYXQiOjE2OTY0NzM2Nzh9.8aSs3HI3-g5Zqv4I2R2nVNP9K3Ar8e8kRNgHc21MBGY" -X PUT http://localhost:8080/v1/customer/profile

change-password: 

book:
	curl -d '{"pickup_address":{"gg_place_id":"0123456789","latitude": 1.2,"longitude": 1.3,"formatted":"123 Main St"},"destination_address":{"gg_place_id":"0123456789","latitude": 1.2,"longitude": 1.3,"formatted":"123 Main St"},"payment_method":1}' -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiZWF0IjoxNjk4MzM4NjYxMTM3LCJpYXQiOjE2OTgyNTIyNjF9.Vc0i4C8_4Kdc16rzMgopi6uHTKaL08rA-uznCftQXpY" -X POST http://localhost:8081/v1/booking/book

recent:
	curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiZWF0IjoxNjk4MzM4NjYxMTM3LCJpYXQiOjE2OTgyNTIyNjF9.Vc0i4C8_4Kdc16rzMgopi6uHTKaL08rA-uznCftQXpY" http://localhost:8081/v1/booking/recent

history:
	curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiZWF0IjoxNjk4MzM4NjYxMTM3LCJpYXQiOjE2OTgyNTIyNjF9.Vc0i4C8_4Kdc16rzMgopi6uHTKaL08rA-uznCftQXpY" 'http://localhost:8081/v1/booking/history?page=1&limit=20'

pricing:
	curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiZWF0IjoxNjk4MzM4NjYxMTM3LCJpYXQiOjE2OTgyNTIyNjF9.Vc0i4C8_4Kdc16rzMgopi6uHTKaL08rA-uznCftQXpY" http://localhost:8081/v1/booking/vehicle-pricing?trip_distance=10.1

payment:
	curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiZWF0IjoxNjk4MzM4NjYxMTM3LCJpYXQiOjE2OTgyNTIyNjF9.Vc0i4C8_4Kdc16rzMgopi6uHTKaL08rA-uznCftQXpY" http://localhost:8081/v1/booking/payment-method