 
test auto deploy

## 🔄 CI/CD Auto-Deploy
- Push code to GitHub → Jenkins auto-triggers via Poll SCM
- Jenkins builds Docker image → Trivy security scan → Push to AWS ECR
- ArgoCD detects new image → Auto-deploys to Kubernetes
- Zero manual steps required
final test
## Final Clean Pipeline Test
trigger test
webhook trigger test
fresh start test
fresh start
