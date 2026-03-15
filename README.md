# ⬡ GitX — Open Source AI-Powered Dev Platform

> **Created by Akshay Kumar Prasad, Future MLOps Architect**
> GitHub: [Akshay-Techie/GitX-app](https://github.com/Akshay-Techie/GitX-app)

---

## 📌 What is GitX?

GitX is a fully open-source, AI-powered software development platform that combines three powerful tools into one seamless workspace — built for developers who are also their own QA, DevOps, and Production Engineer.

| Page | Tool | Description |
|---|---|---|
| Page 1 | GitX Repository | GitHub-inspired code browser — files, commits, branches, PRs |
| Page 2 | GitX Code | VS Code-style editor with AI panel (right) + terminal (bottom) |
| Page 3 | GitX Pipeline | Jenkins-grade CI/CD builder with live logs and metrics |

---

## ✨ Application Features & Changes

### Author Credit
The splash screen displays the creator identity:
```
Created by Akshay Kumar Prasad, Future MLOps Architect
```

### Navigation System
- **Left `‹` and right `›` arrow buttons** fixed on screen for page navigation
- **Alt + Arrow Left / Right** keyboard shortcuts
- **Alt + 1 / 2 / 3** to jump to any page directly
- **Alt + I** to enter the app from splash
- **Alt + E** to exit back to splash
- **Shift + ?** to show keyboard help dialog

### Accessibility Features
- Skip link for keyboard users at the top of the page
- ARIA `role="application"` and `aria-label` on the main app container
- ARIA `role="navigation"` and `aria-label` on topbar
- `aria-label` on every navigation button
- Screen reader live region `aria-live="polite"` announces page changes
- `role="dialog"` and `aria-modal="true"` on the pipeline creation modal
- `aria-labelledby` linking modal title for screen readers

### System Preference Support
- **Reduced motion**: Detects `prefers-reduced-motion: reduce` — disables all animations and transitions for users who need it
- **High contrast**: Detects `prefers-contrast: more` — switches to pure black backgrounds and white text

### Enhanced Animations
- Advanced cubic-bezier transitions: `cubic-bezier(0.34, 1.56, 0.64, 1)` on all interactive elements
- `codeReveal` animation with blur fade-in on editor load
- `lineNumberReveal` stagger animation for line numbers
- `toastBounce` and `toastExit` for toast notifications
- `aiPanelSlideIn` / `aiPanelSlideOut` for AI panel open/close
- `msgSlide` for AI message appearance
- `revealItem` stagger on file rows, run rows, sidebar items
- `activeGlow` on active tab/nav elements
- `gradientShift` on brand name hover
- `badgePop` on repo badges
- `breadcrumbSlide` on breadcrumb navigation
- `modalIn` spring animation on pipeline creation modal

### UI Improvements
- Navigation pills **absolutely centered** in topbar using `position:absolute; left:50%; transform:translate(-50%, -50%)`
- **Shimmer sweep effect** on sidebar items and file rows via `::before` pseudo-element
- Enhanced button press feedback with `scale(0.96)` on `:active`
- Input `focus` lifts element with `translateY(-1px)` and violet glow box-shadow
- Hover elevation on buttons: `translateY(-2px)` with shadow
- Better text selection color using violet rgba

### AI Panel
- Smooth slide-in/out with CSS `width` animation
- Resizable via drag handle on left edge
- Model cycling: GPT-4o → o3 → o4-mini → GPT-4o mini
- Capability chips: Debug, Suggest, Refactor, Explain, Tests

### Terminal
- Command history with Arrow Up / Arrow Down
- Maximize/restore toggle
- Supported commands: `git`, `npm`, `docker`, `ls`, `pwd`, `kubectl`, `gitx`

### Swipe Navigation
- 4-finger trackpad swipe was removed per design decision
- Navigation is now exclusively via on-screen `‹ ›` arrow buttons and keyboard shortcuts

---

## 🏗️ Project Structure

```
Project-GitX/
├── app/
│   ├── public/
│   │   └── index.html      ← GitX frontend (single HTML file, all pages)
│   ├── server.js           ← Express v5 web server (port 3000)
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile          ← node:22-alpine multi-stage build
│   └── .dockerignore
├── jenkins/
│   └── Jenkinsfile         ← 7-stage CI pipeline definition
├── kubernetes/
│   ├── deployment.yaml     ← 2 replicas, ECR image, probes
│   ├── service.yaml        ← NodePort, port 30000
│   └── ingress.yaml        ← Domain routing
├── argocd/
│   └── application.yaml    ← GitOps auto-sync config
├── monitoring/             ← Prometheus/Grafana configs
├── .gitignore
└── README.md
```

---

## 🔄 Complete Automated Workflow

```
Akshay Kumar Prasad writes code in VS Code
        │
        ▼
git push origin main
        │
        ▼ (GitHub webhook → Cloudflare Tunnel → instant trigger)
Jenkins CI Pipeline starts automatically (VMware Ubuntu, localhost:8080)
        │
        ├── Stage 1: Checkout — pulls latest code from GitHub
        ├── Stage 2: Build Docker Image — tags as build-N and latest
        ├── Stage 3: Security Scan — Trivy scans for HIGH/CRITICAL CVEs
        ├── Stage 4: Login to AWS ECR — 12-hour temporary token
        ├── Stage 5: Create ECR Repository — creates if not exists
        ├── Stage 6: Push to ECR — pushes build-N and latest tags
        └── Stage 7: Cleanup — removes local images to free disk space
        │
        ▼
AWS ECR — <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com/gitx-app
        │
        ▼
ArgoCD watches kubernetes/ folder in GitHub (auto-sync every 3 min)
        │
        ▼
Kubernetes (Minikube on VMware Ubuntu)
        ├── Rolling update — zero downtime
        ├── 2 pods running simultaneously during update
        ├── Old pod terminates only after new pod is Ready
        └── NodePort service accessible at port 30000
        │
        ▼
Prometheus scrapes metrics from new pods automatically
        │
        ▼
Grafana dashboards update in real time
```

---

## 🔗 Webhook via Cloudflare Tunnel

Jenkins runs on a private VMware VM (192.168.x.x). GitHub webhooks require a public HTTPS URL. Solution: Cloudflare Tunnel — free, no account required.

### Setup

```bash
# Step 1 — Install Cloudflare Tunnel
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb \
  -o cloudflared.deb
sudo dpkg -i cloudflared.deb
cloudflared --version

# Step 2 — Start tunnel (exposes Jenkins to public internet)
nohup cloudflared tunnel --url http://localhost:8080 > ~/cloudflare.log 2>&1 &

# Step 3 — Get the generated public URL
cat ~/cloudflare.log | grep trycloudflare
# Output: https://some-words.trycloudflare.com
```

### GitHub Webhook Configuration

```
GitHub → GitX-app → Settings → Webhooks → Add webhook

Payload URL:  https://some-words.trycloudflare.com/github-webhook/
Content type: application/json
Secret:       (leave empty)
SSL:          Disable SSL verification
Events:       Just the push event ✅
Active:       ✅
```

### Jenkins Job Configuration

```
gitx-pipeline → Configure → Build Triggers
→ ✅ GitHub hook trigger for GITScm polling
→ (no Poll SCM — webhook handles triggering)
→ Save
```

### How It Works

```
git push origin main
      ↓ (instant — no delay)
GitHub sends POST to https://some-words.trycloudflare.com/github-webhook/
      ↓
Cloudflare Tunnel receives the request
      ↓
Forwards to http://localhost:8080/github-webhook/
      ↓
Jenkins GitHub hook fires
      ↓
Pipeline starts immediately
      ↓
Only triggers on REAL commits — zero wasted builds
```

**Important:** Cloudflare quick tunnel URL changes on every restart. Update the GitHub webhook URL after restarting the tunnel. For a permanent URL, create a named tunnel with a free Cloudflare account.

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone and Run Locally
```bash
git clone https://github.com/Akshay-Techie/GitX-app.git
cd GitX-app/app
npm install
node server.js
# Open http://localhost:3000 → Press Alt+I
```

### Step 2 — Configure Git
```bash
git config --global user.name "your-github-username"
git config --global user.email "your-email@example.com"
```

### Step 3 — Build and Test Docker
```bash
cd ~/Real-World-Projects/Project-GitX
docker build -t gitx-app:latest ./app
docker run -d -p 3000:3000 --name gitx-test gitx-app:latest
# Open http://localhost:3000
docker stop gitx-test && docker rm gitx-test
```

### Step 4 — Install Jenkins on Ubuntu (VMware)
```bash
sudo apt install -y fontconfig openjdk-17-jre
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt update && sudo apt install -y jenkins
sudo usermod -aG docker jenkins
sudo systemctl start jenkins && sudo systemctl enable jenkins
# Access: http://localhost:8080
```

### Step 5 — Pre-install Trivy
```bash
sudo wget -qO- \
  https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
  | sudo sh -s -- -b /usr/local/bin
trivy --version
```

### Step 6 — Configure AWS
```bash
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY_ID
# AWS Secret Access Key: YOUR_SECRET_ACCESS_KEY
# Default region: your-preferred-region (e.g. ap-south-1)
# Output format: json
```

### Step 7 — Add Jenkins Credentials
```
Manage Jenkins → Credentials → System → Global → Add Credentials

Secret Text credentials:
  ID: aws-account-id          Value: YOUR_AWS_ACCOUNT_ID
  ID: aws-region              Value: YOUR_AWS_REGION
  ID: aws-access-key-id       Value: YOUR_IAM_ACCESS_KEY
  ID: aws-secret-access-key   Value: YOUR_IAM_SECRET_KEY
  ID: git-username            Value: your-github-username
  ID: git-email               Value: your-email@example.com

Username/Password credential:
  ID: github-credentials
  Username: your-github-username
  Password: YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

### Step 8 — Create Jenkins Pipeline Job
```
New Item → gitx-pipeline → Pipeline → OK

Pipeline section:
  Definition: Pipeline script from SCM
  SCM: Git
  Repository URL: https://github.com/your-github-username/GitX-app.git
  Branch: */main
  Script Path: jenkins/Jenkinsfile

Build Triggers:
  ✅ GitHub hook trigger for GITScm polling

Save → Build Now (first time only to register trigger)
```

### Step 9 — Start Cloudflare Tunnel and Add Webhook
```bash
nohup cloudflared tunnel --url http://localhost:8080 > ~/cloudflare.log 2>&1 &
sleep 5
cat ~/cloudflare.log | grep trycloudflare
# Copy: https://YOUR-URL.trycloudflare.com
```
Add to GitHub Webhooks:
```
Payload URL: https://YOUR-URL.trycloudflare.com/github-webhook/
Content type: application/json | SSL: Disabled | Events: Push only
```

### Step 10 — Kubernetes Setup
```bash
minikube start --driver=docker
kubectl get nodes

# Create ECR image pull secret
kubectl create secret docker-registry ecr-secret \
  --docker-server=YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_AWS_REGION.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region YOUR_AWS_REGION)

kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl get pods
minikube service gitx-app-service --url
```

### Step 11 — ArgoCD
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Expose ArgoCD UI
kubectl patch svc argocd-server -n argocd \
  -p '{"spec": {"type": "NodePort"}}'
minikube service argocd-server -n argocd --url

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Apply GitOps application
kubectl apply -f argocd/application.yaml
kubectl get application -n argocd
```

### Step 12 — Prometheus + Grafana
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm repo add prometheus-community \
  https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring
helm install monitoring \
  prometheus-community/kube-prometheus-stack \
  --namespace monitoring

# Access Grafana (port 3001 to avoid conflict with app port 3000)
kubectl port-forward svc/monitoring-grafana 3001:80 -n monitoring &
# Open http://localhost:3001 | admin / prom-operator

# Access Prometheus
kubectl port-forward svc/monitoring-kube-prometheus-prometheus \
  9090:9090 -n monitoring &
# Open http://localhost:9090
```

---

## ⚙️ Tech Stack

| Tool | Version | Role |
|---|---|---|
| Node.js | v24 | Application runtime |
| Express | v5 | Web server — serves frontend on port 3000 |
| Docker | 24+ | Containerizes app into portable image |
| Jenkins | 2.541.2 | CI pipeline — build, scan, push to ECR |
| Trivy | v0.69.3 | Container security scanning |
| AWS ECR | — | Private Docker image registry |
| Minikube | v1.38.1 | Local single-node Kubernetes cluster |
| kubectl | v1.35.2 | Kubernetes CLI |
| ArgoCD | v3.3.3 | GitOps continuous delivery |
| Helm | v3 | Kubernetes package manager |
| Prometheus | — | Metrics collection and alerting |
| Grafana | — | Monitoring dashboards |
| Cloudflare Tunnel | latest | Public HTTPS URL for Jenkins webhook |

---

## 🐛 Issues Fixed

### Issue 1 — Express v5 Wildcard Route Error
**Error:** `PathError: Missing parameter name at index 1: *`
**Cause:** Node.js v24 auto-installs Express v5. Express v5 removed `app.get('*')` wildcard support.
**Fix:**
```javascript
// ❌ Express v4 (broken on v5)
app.get('*', (req, res) => res.sendFile(...))

// ✅ Express v5 fix
app.get('/{*splat}', (req, res) => res.sendFile(...))
```

### Issue 2 — Jenkins Docker Permission Denied
**Error:** `Got permission denied while trying to connect to the Docker daemon socket`
**Fix:**
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue 3 — Trivy Permission Denied at Pipeline Runtime
**Error:** `cannot create regular file '/usr/local/bin/trivy': Permission denied`
**Cause:** Jenkins user has no sudo — cannot install Trivy inside pipeline.
**Fix:** Pre-install Trivy once with sudo before any build runs.

### Issue 4 — Kubernetes ImagePullBackOff
**Error:** Pods stuck in `ImagePullBackOff` — cannot pull from private ECR.
**Fix:** Create a Kubernetes docker-registry secret with AWS credentials and reference it in deployment.yaml via `imagePullSecrets`.

### Issue 5 — Jenkins Out of Memory on VirtualBox
**Symptom:** Jenkins service timed out. Only 109MB RAM free. Browser showed connection refused.
**Fix:** Migrated from VirtualBox to VMware. VMware provides better memory management (5.7GB available).

### Issue 6 — Git Identity Unknown
**Error:** `Author identity unknown — Please tell me who you are`
**Fix:**
```bash
git config --global user.name "your-github-username"
git config --global user.email "your-email@example.com"
```

### Issue 7 — Groovy Hash Comment Syntax Error
**Error:** `unexpected char: '#' @ line 109, column 25`
**Cause:** `#` is not a valid comment character inside Groovy `sh """` blocks.
**Fix:** Removed all `#` inline comments from inside shell blocks. Used `//` Groovy comments outside `sh` blocks only.

### Issue 8 — Git Push Rejected (Non-fast-forward)
**Error:** `Updates were rejected because the remote contains work not in local`
**Fix:**
```bash
git pull origin main --rebase
git push origin main
```

### Issue 9 — Merge Conflict in deployment.yaml
**Symptom:** Conflict during rebase when local and remote both changed `deployment.yaml`
**Fix:**
```bash
git checkout --ours kubernetes/deployment.yaml
git add kubernetes/deployment.yaml
git rebase --continue
```

---

## ⚠️ Precautions

### Security
- **Never hardcode** AWS credentials, account IDs, tokens, or emails in any file pushed to GitHub
- All sensitive values live exclusively in **Jenkins Credentials Store** — they appear masked as `****` in build logs
- Use IAM users with minimum required permissions (ECR push only — not admin)
- Add `.env` to `.gitignore` — never commit environment files

### Cloudflare Tunnel
- The quick tunnel URL **changes every time** the tunnel restarts
- Always run the tunnel in the background: `nohup cloudflared tunnel --url ... &`
- After restarting, get the new URL from `~/cloudflare.log` and update the GitHub webhook
- For a permanent URL that never changes: create a named tunnel at cloudflare.com (free account)

### Kubernetes
- The ECR pull secret **expires when AWS credentials rotate** — recreate it immediately after rotation
- Resource limits in `deployment.yaml` prevent pods from consuming all VM memory
- Always use `imagePullPolicy: Always` so Kubernetes always pulls the latest ECR image
- Keep 2 replicas minimum — ensures zero-downtime rolling updates

### Jenkins
- Backup Jenkins data at `/var/lib/jenkins` before any upgrades
- Pre-install all CLI tools (Trivy, AWS CLI, Docker) — never install inside pipeline stages
- The ECR login token expires every 12 hours — Jenkins re-authenticates on every build automatically
- Free RAM before heavy builds: stop unused services

### Memory Requirements
| Service | Memory Needed |
|---|---|
| Jenkins | ~430 MB |
| Minikube + K8s | ~1.2 GB |
| Prometheus | ~300 MB |
| Grafana | ~200 MB |
| ArgoCD | ~250 MB |
| **Total Minimum** | **4 GB RAM** |

---

## 📊 Monitoring

### Grafana Dashboard IDs
| Dashboard | Import ID | What It Shows |
|---|---|---|
| Node Exporter Full | `1860` | CPU, RAM, Disk, Network of VM |
| Kubernetes Cluster | `15760` | Pod and deployment metrics |
| Kubernetes Pods | `6417` | Individual pod resource usage |

### Prometheus Datasource URL
```
http://monitoring-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090
```

### Port Forwarding Commands
```bash
# Grafana
kubectl port-forward svc/monitoring-grafana 3001:80 -n monitoring &

# Prometheus
kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring &
```

---

## 🔁 Rollback

```bash
# Rollback to previous Kubernetes deployment version
kubectl rollout undo deployment/gitx-app

# Rollback to a specific version
kubectl rollout undo deployment/gitx-app --to-revision=2

# Check rollout history
kubectl rollout history deployment/gitx-app

# Verify current image after rollback
kubectl describe deployment gitx-app | grep Image
```

---

## ✅ Final Project Status

| Step | Component | Status |
|---|---|---|
| 1 | Project Structure | ✅ Complete |
| 2 | Git & GitHub | ✅ Single clean commit |
| 3 | Docker | ✅ node:22-alpine image |
| 4 | Jenkins Install | ✅ VMware Ubuntu, v2.541.2 |
| 5 | AWS ECR | ✅ ap-south-1 |
| 6 | Jenkins Pipeline | ✅ All 7 stages green |
| 7 | Cloudflare Webhook | ✅ Instant trigger on real push |
| 8 | Kubernetes | ✅ 2 pods running, NodePort 30000 |
| 9 | ArgoCD | ✅ Synced and Healthy |
| 10 | Prometheus + Grafana | ✅ Dashboards live |

---

## 👤 Author

**Akshay Kumar Prasad** — *Future MLOps Architect*
GitHub: [Akshay-Techie](https://github.com/Akshay-Techie)
Repository: [GitX-app](https://github.com/Akshay-Techie/GitX-app)

---

## 📄 License

MIT License — Open Source