# Retrospective AI - Project Summary

## Overview
Retrospective AI is a full-stack web application that integrates with Azure DevOps to retrieve and analyze retrospective boards from multiple projects and teams.

## Key Features
1. **Azure DevOps Integration**: Connects to Azure DevOps API to fetch projects, teams, and retrospective boards using a Personal Access Token (PAT)
2. **Portfolio Classification**: Automatically classifies 57+ projects into 6 portfolios (Products Safety & Logistics, Justice and Urban Development, QoL & PIF, Enterprise Solutions, Mobility & Industrial Tech, and Digital Venture)
3. **Interactive Dashboard**: Filter projects by portfolio, view team details, and access retrospective boards for continuous improvement tracking
4. **Default Teams Focus**: Displays only default teams under each project for streamlined navigation
5. **Modern Tech Stack**: Built with React (frontend), Node.js/Express (backend), deployed on Render.com as a single full-stack service

## Technical Architecture
- **Frontend**: React with modern UI components and Lucide icons
- **Backend**: Node.js/Express server with Azure DevOps API integration
- **Deployment**: Render.com hosting both frontend and backend from a single service URL
- **Environment**: Secure PAT management via environment variables (.env file)
- **Network**: Configured for TBS-EMP network access

## Portfolio Structure
The application organizes projects into 6 portfolios based on business domains, allowing teams to filter and view projects relevant to their area of focus.

