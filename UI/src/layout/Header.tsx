import { ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/counterStore";
import SignInHeader from "./SignInHeader";
interface Props {
  palatte: string;
  onSetMode: () => void;
}

const midLinks = [
  {
    path: "/catalog",
    title: "catalog",
  },
  {
    path: "/contact",
    title: "contact",
  },
  {
    path: "/about",
    title: "about",
  },
];

const rightLinks = [
  {
    path: "/login",
    title: "login",
  },
  {
    path: "/register",
    title: "register",
  },
];

const navStyles = {
  textDecoration: "none",
  typography: "h6",
  color: "inherit",
  "&:hover": { color: "grey.500" },
  "&.active": {
    color: "text.secondary",
  },
};

const Header = ({ palatte, onSetMode }: Props) => {
  const { basket } = useAppSelector((state) => state.basket);
  const { user } = useAppSelector((state) => state.account);
  const itemCount = basket?.basketItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  return (
    <AppBar position="static" >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component={NavLink} to="/" sx={navStyles}>
            E-STORE
          </Typography>
          <Switch
            checked={palatte == "dark" ? true : false}
            onChange={onSetMode}
          ></Switch>
        </Box>
        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <SignInHeader />
          ) : (
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
