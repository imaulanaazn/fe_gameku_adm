import { ServerIdType } from "@/enum";
import { getTitleByGamesCategory } from "@/lib/getTitleCategoryId";
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
const GameData = ({ data, onChange, value, position }: any) => {
  const { labelGameData } = getTitleByGamesCategory(data);

  if (data.type === "topup") {
    return (
      <Card
        sx={{
          marginTop: position > 1 ? 4 : 0,
          borderRadius: "0.75rem",
          background:
            "#ffffff url(/images/topup-form-step-1.svg) no-repeat right top",
          backgroundSize: "150px",
        }}
        elevation={1}
      >
        <CardHeader
          title="Data Akun"
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: "2rem !important",
              letterSpacing: "0.15px !important",
              color: "#1F2937",
              fontWeight: "900",
            },
          }}
        />
        <CardContent
          sx={{
            pt: (theme) => `${theme.spacing(3)} !important`,
            paddingX: "1.25rem",
          }}
        >
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={data.needServerId ? 6 : 12}>
              <TextField
                value={value.userId}
                autoFocus
                fullWidth
                id="userId"
                label={labelGameData}
                sx={{
                  marginBottom: 2.5,
                  "& .MuiFormLabel-root": { color: "#B72025" },
                  "& input": {
                    border: "1px solid #B72025",
                    borderRadius: "0.4rem",
                  },
                  "& .MuiInputLabel-root": {
                    background: "white",
                  },
                }}
                onChange={(e) => onChange("userId", e.target.value)}
              />
            </Grid>

            {data &&
              data.needServerId &&
              data.typeServerId === ServerIdType.INPUT && (
                <Grid item xs={12} md={6}>
                  <TextField
                    value={value.serverId}
                    autoFocus
                    fullWidth
                    id="serverId"
                    label="Server ID"
                    sx={{
                      marginBottom: 2.5,
                      "& .MuiFormLabel-root": { color: "#B72025" },
                      "& input": {
                        border: "1px solid #B72025",
                        borderRadius: "0.4rem",
                      },
                      "& .MuiInputLabel-root": {
                        background: "white",
                      },
                    }}
                    onChange={(e) => onChange("serverId", e.target.value)}
                  />
                </Grid>
              )}

            {data &&
              data.needServerId &&
              data.typeServerId === ServerIdType.LIST && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{ background: "white", color: "#B72025" }}
                    >
                      Server ID
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={value.serverId}
                      label="Age"
                      sx={{ border: "1px solid #B72025" }}
                      onChange={(e) => onChange("serverId", e.target.value)}
                    >
                      {data.listServer.map((item: any) => (
                        <MenuItem key={item.id} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
          </Grid>
        </CardContent>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default GameData;
