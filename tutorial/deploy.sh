server=ubuntu@52.59.71.133

# Frontend-Only deployment
# npm run build
rsync -avz --delete -e 'ssh' "dist/" "${server}:how-to-write-a-typescript-library/dist"
exit 0

