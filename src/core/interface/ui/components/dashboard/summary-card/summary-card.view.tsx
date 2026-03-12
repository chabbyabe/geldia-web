import { Avatar, Box, Card, CardContent, Icon, Stack, Typography } from "@mui/material";
import React from "react";
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity";
import { ICON_MAP } from "@interface/presenters/constants";

export interface ISummaryCardView {
  children?: React.ReactNode
  data: ISummary[]
}

const SummaryCardView: React.FC<ISummaryCardView> = (props) => {

  return (
    <>
      {props.data.map((item, index) => (

        <Card
          key={`${index}-summary-card`}
          sx={{
            borderRadius: 4,
            border: `1px solid ${item.color}`,
            backgroundColor: `${item.color}15`,
            mb: 2,
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: item.color ?? "grey", width: 60, height: 60 }}>
                <Icon component={ICON_MAP[item.name]} fontSize="large" sx={{ color: "white" }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" color={item.color ?? "primary"}>
                  {item.formattedAmount}
                </Typography>
                <Typography variant="h6">{item.name}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
export default SummaryCardView;