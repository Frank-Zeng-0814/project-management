import prisma from "../configs/prisma";

// Get all workspaces for a user
export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: { some: { userId: userId } },
      },
      include: {
        members: { include: { user: true } },
        projects: {
          include: {
            tasks: {
              include: {
                assignee: true,
                comments: {
                  include: { user: true },
                },
              },
            },
          },
        },
        owner: true,
      },
    });
    res.json({ workspaces });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { email, role, workspaceId, message } = req.body;

    //check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!workspaceId || !role) {
      return res.status(400).json({ message: "Missing required parameters" });
    }
    if (!["ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    //fetch workspace
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
      //check if the requester is admin
      if (!workspace.members.find((member) => member.userId === userId && member.role === "ADMIN")) {
          return res.status(401).json({message: "You don not have admin privileges"})
      }
      //check if the user is already a member
      const existingMember = await prisma.workspaceMember.find((member) => member.userId === user.id);
      if (existingMember) {
          return res.status(400).json({message: "User is already a member of the workspace"});
      }

      const newMember = await prisma.workspaceMember.create({
          data: {
            userId: user.id,
            workspaceId,
            role,
            message,
          }
      })
      res.json({member, message: "Member added successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
