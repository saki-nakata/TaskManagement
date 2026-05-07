output "ec2_public_ip" {
  description = "EC2のパブリックIP（固定）"
  value       = aws_eip.app.public_ip
}

output "ssh_command" {
  description = "SSH接続コマンド"
  value       = "ssh -i ~/.ssh/${var.ec2_key_pair_name}.pem ec2-user@${aws_eip.app.public_ip}"
}

output "app_url" {
  description = "アプリケーションURL"
  value       = "http://${aws_eip.app.public_ip}"
}
