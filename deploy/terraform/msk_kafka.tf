# Amazon Managed Streaming for Apache Kafka (MSK) - Mumbai Primary Cluster
resource "aws_kms_key" "msk_kms" {
  provider                = aws.primary
  description             = "KMS Key for MSK Kafka cluster encryption - Mumbai"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_msk_cluster" "primary_kafka" {
  provider               = aws.primary
  cluster_name           = "krishi-saarthi-kafka-events"
  kafka_version          = "3.6.0"
  number_of_broker_nodes = 3

  broker_node_group_info {
    instance_type   = "kafka.m5.xlarge"
    client_subnets  = [aws_subnet.primary_priv_a.id, aws_subnet.primary_priv_b.id, aws_subnet.primary_priv_c.id]
    security_groups = [aws_security_group.kafka_sg.id]
    storage_info {
      ebs_storage_info {
        volume_size = 500
      }
    }
  }

  encryption_info {
    encryption_at_rest_kms_key_arn = aws_kms_key.msk_kms.arn
    encryption_in_transit {
      client_broker = "TLS"
      in_cluster    = true
    }
  }

  client_authentication {
    sasl {
      scram = true
      iam   = true
    }
  }

  logging_info {
    broker_logs {
      cloudwatch_logs {
        enabled   = true
        log_group = "/aws/msk/krishi-saarthi-events"
      }
    }
  }
}
