import { CardContent, Avatar, Typography, Card, Box } from "@mui/material";

const ProfileGame = ({ denoms }: { denoms: IGameDetail }) => {
    return (
        <Card sx={{ position: "relative" }}>
            <CardContent>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Avatar src={denoms.logoUrl} variant="rounded" sx={{ width: 120, height: 120 }} />
                </Box>
                <Typography variant="h6" sx={{ letterSpacing: "0.25px", fontWeight: 800, marginTop: 1.5 }}>
                    {denoms.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ letterSpacing: "0.25px", marginTop: 1.5 }}
                    dangerouslySetInnerHTML={{ __html: denoms.description }}
                ></Typography>
            </CardContent>
        </Card>
    );
};

export default ProfileGame;
