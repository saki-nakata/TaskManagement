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

    # Docker（Spring Boot コンテナの実行に使用。Java は Docker イメージ内に含まれる）
    dnf install -y docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user

    # Nginx（フロントエンド配信 + Spring Boot へのリバースプロキシ）
    dnf install -y nginx
    systemctl enable nginx
    systemctl start nginx

    # Node.js 20 LTS（フロントエンドの起動・ビルドに必要）
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs

    # pnpm（このプロジェクトのパッケージマネージャー）
    npm install -g pnpm
  EOF

  tags = { Name = "${var.project_name}-app" }
}

# 固定IP（インスタンス再起動後もIPが変わらない）
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  tags = { Name = "${var.project_name}-eip" }
}
