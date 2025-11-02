

// Add comments
export const addComment = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
}