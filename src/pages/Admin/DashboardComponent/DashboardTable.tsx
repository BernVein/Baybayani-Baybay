import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
} from "@heroui/react";

export function DashboardTable() {
  return (
    <>
      <Table isHeaderSticky removeWrapper className="overflow-y-auto">
        <TableHeader>
          <TableColumn>ITEM</TableColumn>
          <TableColumn>NEEDED</TableColumn>
        </TableHeader>

        <TableBody emptyContent={"No low stock item."}>
          <TableRow key="1">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 1</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 2</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 3</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 4</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="5">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 5</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="6">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 6</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="7">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 6</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="8">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 6</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="9">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 6</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="10">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 6</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
          <TableRow key="11">
            <TableCell>
              <div className="flex flex-row items-center gap-2">
                <Avatar size="sm" />
                <span>Item 6</span>
              </div>
            </TableCell>
            <TableCell>5 kg</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
