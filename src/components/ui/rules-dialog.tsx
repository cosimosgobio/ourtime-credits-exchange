
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Coins, Info } from "lucide-react";

export function RulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Info className="h-4 w-4" /> Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-primary">OurTime Rules</span>
            <span className="text-xl">⏱️</span>
          </DialogTitle>
          <DialogDescription>
            How the OurTime platform works
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <section className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-accent" /> Credits System
            </h3>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li><span className="font-medium text-background-foreground">100 free credits</span> for new users when they join OurTime</li>
              <li><span className="font-medium text-background-foreground">10 free credits</span> awarded to all users weekly</li>
              <li>Earn credits by performing activities for other users</li>
              <li>Spend credits to get help from other users</li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Activity Types</h3>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li><span className="font-medium text-background-foreground">Perform:</span> Browse activities you can complete to earn credits</li>
              <li><span className="font-medium text-background-foreground">Create:</span> Post activities you need help with by spending credits</li>
              <li><span className="font-medium text-background-foreground">Buy:</span> Search for services you can purchase with your credits</li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Community Guidelines</h3>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li>Always be respectful and professional when interacting with others</li>
              <li>Complete activities on time and as described</li>
              <li>Rate users honestly after completing an activity</li>
              <li>Report any issues to our support team</li>
            </ul>
          </section>
        </div>
        
        <DialogFooter>
          <Button type="button">Got it, thanks!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
