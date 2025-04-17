module.exports = {
    apps: [
      {
        name: "pixel-vox",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          PORT: 9999
        }
      }
    ]
  };