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
          borderRadius: "0.75rem",
          background: `#161721 url(/images/topup-form-step-${position}.svg) no-repeat right top`,
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
              color: "#ffffff",
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
                  "& .MuiFormLabel-root": { color: "#fb923ce6" },
                  "& input": {
                    border: "1px solid #fb923ce6",
                    borderRadius: "0.4rem",
                    color: "#ffffff",
                  },
                  "& .MuiInputLabel-root": {
                    background: "#161721",
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
                      "& .MuiFormLabel-root": { color: "#fb923ce6" },
                      "& input": {
                        border: "1px solid #fb923ce6",
                        borderRadius: "0.4rem",
                        color: "#ffffff",
                      },
                      "& .MuiInputLabel-root": {
                        background: "#161721",
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
                      sx={{ background: "white", color: "#EAEAEA" }}
                    >
                      Server ID
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={value.serverId}
                      label="Age"
                      sx={{ border: "1px solid #EAEAEA", color: "#ffffff" }}
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
