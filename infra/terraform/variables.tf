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
