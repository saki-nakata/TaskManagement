variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "プロジェクト名（リソース名のプレフィックスに使用）"
  type        = string
  default     = "taskmanagement"
}

variable "ec2_key_pair_name" {
  description = "EC2へのSSHアクセスに使うキーペア名（AWSコンソールで事前作成が必要）"
  type        = string
}

variable "my_ip" {
  description = "自分のPCのパブリックIP（CIDR形式）。`curl ifconfig.me` で確認できる。例: \"203.0.113.1/32\""
  type        = string
}
