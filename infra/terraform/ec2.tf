data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = var.ec2_key_pair_name

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y docker nginx
    systemctl enable docker nginx
    systemctl start docker nginx
    usermod -aG docker ec2-user
  EOF

  tags = { Name = "${var.project_name}-app" }
}

# 固定IP（インスタンス再起動後もIPが変わらない）
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  tags = { Name = "${var.project_name}-eip" }
}
