server=ubuntu@35.158.213.131

# Frontend-Only deployment
npm run build
rsync -avz --delete -e 'ssh' "dist/" "${server}:how-to-write-a-typescript-library/dist"
exit 0

